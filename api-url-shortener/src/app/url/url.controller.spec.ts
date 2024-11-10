import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';
import { UpdateUrlInterface } from 'src/interfaces/url/update-url.interface';
import { SearchByUserUrlInteface } from 'src/interfaces/url/search-by-user-url.interface';
import { SearchByShortUrlInteface } from 'src/interfaces/url/search-by-short-url.interface';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    createUrl: jest.fn(),
    getUrlByUserId: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
    getUrlByShortUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        { provide: UrlService, useValue: mockUrlService },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('deve criar uma URL', async () => {
    const createUrlPayload: CreateUrlInterface = {
      original_url: 'http://teste.com',
      user_id: 'user123',
    };

    const createdUrl: Url = {
      url_id: 'some-id',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      status: 1,
      updated_at: new Date(),
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(service, 'createUrl').mockResolvedValue(createdUrl);

    expect(await controller.createUrl(createUrlPayload)).toEqual(createdUrl);
  });

  it('deve obter URLs por user_id', async () => {
    const getUrlByUserIdPayload: SearchByUserUrlInteface = {
      user_id: 'user123',
    };

    const urls: Url[] = [
      {
        url_id: 'some-id',
        original_url: 'http://teste.com',
        short_url: '123',
        click_count: 10,
        created_at: new Date(),
        status: 1,
        updated_at: new Date(),
        deleted_at: null,
        user_id: 'user123',
      },
      {
        url_id: 'id123',
        original_url: 'http://teste.com',
        short_url: '123',
        click_count: 5,
        created_at: new Date(),
        status: 1,
        updated_at: new Date(),
        deleted_at: null,
        user_id: 'user123',
      },
    ];

    jest.spyOn(service, 'getUrlByUserId').mockResolvedValue(urls);

    expect(await controller.getUrlById(getUrlByUserIdPayload)).toEqual(urls);
  });

  it('deve atualizar uma URL', async () => {
    const updateUrlPayload: UpdateUrlInterface = {
      url_id: '1234',
      data: {
        original_url: 'http://teste.com',
        short_url: '123',
        click_count: 100,
        status: 1,
        user_id: 'user123',
      }
    };

    const updatedUrl: Url = {
      url_id: '1234',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 100,
      created_at: new Date(),
      status: 1,
      updated_at: new Date(),
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(service, 'updateUrl').mockResolvedValue(updatedUrl);

    expect(await controller.updateUrl(updateUrlPayload)).toEqual(updatedUrl);
  });

  it('deve excluir uma URL', async () => {
    const deleteUrlPayload = {
      url_id: '1234',
      user_id: 'user123',
    };

    const deletedUrl: Url = {
      url_id: '1234',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      status: 0,
      updated_at: new Date(),
      deleted_at: new Date(),
      user_id: 'user123',
    };

    jest.spyOn(service, 'deleteUrl').mockResolvedValue(deletedUrl);

    expect(await controller.deleteUrl(deleteUrlPayload)).toEqual(deletedUrl);
  });

  it('deve obter uma URL por short URL', async () => {
    const getUrlByShortUrlPayload: SearchByShortUrlInteface = {
      short_url: '123',
    };

    const url: Url = {
      url_id: 'some-id',
      original_url: 'http://teste.com',
      short_url: '123',
      click_count: 0,
      created_at: new Date(),
      status: 1,
      updated_at: new Date(),
      deleted_at: null,
      user_id: 'user123',
    };

    jest.spyOn(service, 'getUrlByShortUrl').mockResolvedValue(url);

    expect(await controller.getUrlByShortUrl(getUrlByShortUrlPayload)).toEqual(url);
  });
});
