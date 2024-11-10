import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { Prisma } from '@prisma/client';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;
  let helpersService: HelpersService;

  const mockUrlRepository = {
    createUrl: jest.fn(),
    getUrlByUserId: jest.fn(),
    getUrlById: jest.fn(),
    getUrlByShortUrl: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
  };

  const mockHelpersService = {
    generateUrl: jest.fn().mockReturnValue('123'),
  };

  beforeEach(() => {
    urlRepository = mockUrlRepository as any;
    helpersService = mockHelpersService as any;
    service = new UrlService(urlRepository, helpersService);
  });

  it('deve criar uma URL com URL encurtada gerada automaticamente', async () => {
    const createUrlPayload = {
      original_url: 'http://teste.com',
      user_id: 'user123',
    };

    const createdUrl = {
      url_id: 'some-id',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      status: 1,
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(urlRepository, 'createUrl').mockResolvedValue(createdUrl);
    jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);

    expect(await service.createUrl(createUrlPayload)).toEqual(createdUrl);
  });

  it('deve lançar erro de conflito ao tentar criar uma URL com short_url existente', async () => {
    const createUrlPayload = {
      original_url: 'http://teste.com',
      user_id: 'user123',
      short_url: '123',
    };

    const existingUrl = {
      url_id: 'existing-id',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      status: 1,
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(existingUrl);

    await expect(service.createUrl(createUrlPayload)).rejects.toThrow(
      new ConflictException(
        'Url encurtada já existe, escreve uma nova ou deixe ser gerada automaticamente',
      ),
    );
  });

  it('deve retornar as URLs de um usuário', async () => {
    const userId = 'user123';
    const urls = [
      {
        url_id: 'some-id',
        original_url: 'http://teste.com',
        short_url: '123',
        click_count: 10,
        created_at: new Date(),
        updated_at: new Date(),
        status: 1,
        deleted_at: null,
        user_id: 'user123',
      },
    ];

    jest.spyOn(urlRepository, 'getUrlByUserId').mockResolvedValue(urls);

    expect(await service.getUrlByUserId(userId)).toEqual(urls);
  });

  it('deve lançar erro de não encontrado ao tentar atualizar uma URL que não existe', async () => {
    const urlId = 'nonexistent-id';
    const updateData: Partial<Prisma.UrlUpdateInput> = {
      original_url: 'http://teste.com',
    };

    jest.spyOn(urlRepository, 'getUrlById').mockResolvedValue(null);

    await expect(service.updateUrl(urlId, updateData)).rejects.toThrow(
      new NotFoundException('Registro não encontrado'),
    );
  });

  it('deve atualizar uma URL com sucesso', async () => {
    const urlId = 'existing-id';
    const updateData: Partial<Prisma.UrlUpdateInput> = {
      original_url: 'http://teste.com',
    };

    const updatedUrl = {
      url_id: urlId,
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 10,
      created_at: new Date(),
      updated_at: new Date(),
      status: 1,
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(urlRepository, 'getUrlById').mockResolvedValue(updatedUrl);
    jest.spyOn(urlRepository, 'updateUrl').mockResolvedValue(updatedUrl);

    expect(await service.updateUrl(urlId, updateData)).toEqual(updatedUrl);
  });

  it('deve lançar erro de não encontrado ao tentar excluir uma URL que não existe', async () => {
    const deleteData = { url_id: 'nonexistent-id', user_id: 'user123' };

    jest.spyOn(urlRepository, 'getUrlById').mockResolvedValue(null);

    await expect(service.deleteUrl(deleteData)).rejects.toThrow(
      new NotFoundException('Registro não encontrado'),
    );
  });

  it('deve excluir uma URL com sucesso', async () => {
    const deleteData = { url_id: 'existing-id', user_id: 'user123' };

    const deletedUrl = {
      url_id: 'existing-id',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      status: 0,
      deleted_at: new Date(),
      user_id: 'user123',
    };

    jest.spyOn(urlRepository, 'getUrlById').mockResolvedValue(deletedUrl);
    jest.spyOn(urlRepository, 'deleteUrl').mockResolvedValue(deletedUrl);

    expect(await service.deleteUrl(deleteData)).toEqual(deletedUrl);
  });

  it('deve retornar a URL por short_url e atualizar o contador de cliques', async () => {
    const shortUrl = '123';

    const url = {
      url_id: 'some-id',
      original_url: 'http://teste.com',
      short_url: shortUrl,
      click_count: 10,
      created_at: new Date(),
      updated_at: new Date(),
      status: 1,
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(url);
    jest.spyOn(urlRepository, 'updateUrl').mockResolvedValue({
      ...url,
      click_count: 11,
    });

    expect(await service.getUrlByShortUrl(shortUrl)).toEqual(url);
  });

  it('deve lançar erro de não encontrado ao tentar buscar uma URL por short_url que não existe', async () => {
    const shortUrl = 'nonexistent-url';

    jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);

    await expect(service.getUrlByShortUrl(shortUrl)).rejects.toThrow(
      new NotFoundException('Registro não encontrado'),
    );
  });
});
