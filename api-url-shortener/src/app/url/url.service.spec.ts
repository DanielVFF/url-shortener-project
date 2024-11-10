import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;
  let helpersService: HelpersService;

  const mockUrl: Url = {
    url_id: '1',
    original_url: 'https://example.com',
    short_url: 'abcd1234',
    user_id: 'user1',
    status: 1,
    created_at: new Date(),
    deleted_at: new Date(),
    click_count: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UrlRepository,
          useValue: {
            getUrlByShortUrl: jest.fn(),
            createUrl: jest.fn().mockResolvedValue(mockUrl),
            getUrlByUserId: jest.fn().mockResolvedValue([mockUrl]),
            updateUrl: jest.fn().mockResolvedValue(mockUrl),
            deleteUrl: jest.fn().mockResolvedValue(mockUrl),
          },
        },
        {
          provide: HelpersService,
          useValue: {
            generateUrl: jest.fn().mockReturnValue('unique123'),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<UrlRepository>(UrlRepository);
    helpersService = module.get<HelpersService>(HelpersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createUrl', () => {
    it('deve gerar um short_url se não for fornecido e criar a URL', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);
      const data: CreateUrlInterface = {
        original_url: 'https://example.com',
        user_id: 'user1',
      };
      const result = await service.createUrl(data);
      expect(helpersService.generateUrl).toHaveBeenCalled();
      expect(urlRepository.createUrl).toHaveBeenCalledWith({
        ...data,
        short_url: 'unique123',
      });
      expect(result).toEqual(mockUrl);
    });

    it('deve lançar um erro de conflito se o short_url já existir', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(mockUrl);
      const data: CreateUrlInterface = {
        original_url: 'https://example.com',
        short_url: 'abcd1234',
        user_id: 'user1',
      };
      await expect(service.createUrl(data)).rejects.toThrow(ConflictException);
    });
  });

  describe('getUrlByUserId', () => {
    it('deve retornar as URLs de um usuário pelo user_id', async () => {
      const result = await service.getUrlByUserId('user1');
      expect(urlRepository.getUrlByUserId).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockUrl]);
    });
  });

  describe('updateUrl', () => {
    it('deve atualizar uma URL existente', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(mockUrl);
      const data = { original_url: 'https://new-url.com' };
      const result = await service.updateUrl('1', data);
      expect(urlRepository.updateUrl).toHaveBeenCalledWith('1', data);
      expect(result).toEqual(mockUrl);
    });

    it('deve lançar um erro se a URL não for encontrada', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);
      await expect(service.updateUrl('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUrl', () => {
    it('deve deletar uma URL se o user_id e short_url coincidirem', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(mockUrl);
      const result = await service.deleteUrl({
        short_url: 'abcd1234',
        user_id: 'user1',
      });
      expect(urlRepository.deleteUrl).toHaveBeenCalledWith({
        short_url: 'abcd1234',
        user_id: 'user1',
      });
      expect(result).toEqual(mockUrl);
    });

    it('deve lançar um erro se a URL não for encontrada ou se o user_id não coincidir', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);
      await expect(
        service.deleteUrl({ short_url: 'abcd1234', user_id: 'user2' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUrlByShortUrl', () => {
    it('deve retornar uma URL e incrementar o contador de cliques', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(mockUrl);
      const result = await service.getUrlByShortUrl('abcd1234');
      expect(urlRepository.updateUrl).toHaveBeenCalledWith('1', {
        click_count: mockUrl.click_count + 1,
      });
      expect(result).toEqual(mockUrl);
    });

    it('deve lançar um erro se a URL não for encontrada', async () => {
      jest.spyOn(urlRepository, 'getUrlByShortUrl').mockResolvedValue(null);
      await expect(service.getUrlByShortUrl('invalid123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
