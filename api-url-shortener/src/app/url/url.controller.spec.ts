import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';
import { SearchByUserUrlInteface } from 'src/interfaces/url/search-by-user-url.interface';
import { UpdateUrlInterface } from 'src/interfaces/url/update-url.interface';
import { SearchByShortUrlInteface } from 'src/interfaces/url/search-by-short-url.interface';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrl: Url = {
    url_id: '1',
    original_url: 'https://example.com',
    short_url: 'abcd1234',
    user_id: 'user1',
    click_count: 0,
    status: 0,
    created_at: new Date(),
    deleted_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            createUrl: jest.fn().mockResolvedValue(mockUrl),
            getUrlByUserId: jest.fn().mockResolvedValue([mockUrl]),
            updateUrl: jest.fn().mockResolvedValue(mockUrl),
            deleteUrl: jest.fn().mockResolvedValue(mockUrl),
            getUrlByShortUrl: jest.fn().mockResolvedValue(mockUrl),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createUrl', () => {
    it('deve chamar o service.createUrl com os dados corretos e retornar o resultado', async () => {
      const data: CreateUrlInterface = {
        original_url: 'https://example.com',
        user_id: 'user1',
      };
      const result = await controller.createUrl(data);
      expect(service.createUrl).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockUrl);
    });
  });

  describe('getUrlById', () => {
    it('deve chamar o service.getUrlByUserId com o user_id correto e retornar o resultado', async () => {
      const data: SearchByUserUrlInteface = { user_id: 'user1' };
      const result = await controller.getUrlById(data);
      expect(service.getUrlByUserId).toHaveBeenCalledWith(data.user_id);
      expect(result).toEqual([mockUrl]);
    });
  });

  describe('updateUrl', () => {
    it('deve chamar o service.updateUrl com os dados corretos e retornar o resultado', async () => {
      const data: UpdateUrlInterface = {
        url_id: '1',
        data: { original_url: 'https://updated.com' },
      };
      const result = await controller.updateUrl(data);
      expect(service.updateUrl).toHaveBeenCalledWith(data.url_id, data.data);
      expect(result).toEqual(mockUrl);
    });
  });

  describe('deleteUrl', () => {
    it('deve chamar o service.deleteUrl com os dados corretos e retornar o resultado', async () => {
      const data: SearchByShortUrlInteface & SearchByUserUrlInteface = {
        short_url: 'abcd1234',
        user_id: 'user1',
      };
      const result = await controller.deleteUrl(data);
      expect(service.deleteUrl).toHaveBeenCalledWith({
        short_url: data.short_url,
        user_id: data.user_id,
      });
      expect(result).toEqual(mockUrl);
    });
  });

  describe('getUrlByShortUrl', () => {
    it('deve chamar o service.getUrlByShortUrl com o short_url correto e retornar o resultado', async () => {
      const data: SearchByShortUrlInteface = { short_url: 'abcd1234' };
      const result = await controller.getUrlByShortUrl(data);
      expect(service.getUrlByShortUrl).toHaveBeenCalledWith(data.short_url);
      expect(result).toEqual(mockUrl);
    });
  });
});
