import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { RabbitmqService } from 'src/infrastructure/rabbitmq/rabbitmq.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlIdDto } from './dto/validate-url-id.dto';
import { Response } from 'express';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

describe('UrlController', () => {
  let controller: UrlController;
  let brokerService: RabbitmqService;

  const mockRabbitmqService = {
    sendMessage: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockOptionalJwtAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockEnvironmentConfigService = {
    getConfigValue: jest.fn().mockReturnValue('fake-value'),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'fake-secret' })],
      controllers: [UrlController],
      providers: [
        {
          provide: RabbitmqService,
          useValue: mockRabbitmqService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: OptionalJwtAuthGuard,
          useValue: mockOptionalJwtAuthGuard,
        },
        {
          provide: EnvironmentConfigService,
          useValue: mockEnvironmentConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    brokerService = module.get<RabbitmqService>(RabbitmqService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUrl', () => {
    it('deve criar uma url encurtada', async () => {
      const createUrlDto: CreateUrlDto = { original_url: 'http://example.com' };
      const user_id = 'user123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockResolvedValue({ original_url: 'http://example.com' });

      const result = await controller.createUrl(createUrlDto, {
        user: { user_id },
      } as any);
      expect(result.original_url).toBe('http://example.com');
    });

    it('deve lidar com erros ao criar url', async () => {
      const createUrlDto: CreateUrlDto = { original_url: 'http://invalid-url' };
      const user_id = 'user123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockRejectedValue(new Error('Url inválida'));

      try {
        await controller.createUrl(createUrlDto, { user: { user_id } } as any);
      } catch (error) {
        expect(error.message).toBe('Url inválida');
      }
    });
  });

  describe('getUrlById', () => {
    it('deve retornar todas as urls criadas por um usuario', async () => {
      const user_id = 'user123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockResolvedValue([{ original_url: 'http://example.com' }]);

      const result = await controller.getUrlById({ user: { user_id } } as any);
      expect(result).toHaveLength(1);
      expect(result[0].original_url).toBe('http://example.com');
    });

    it('Deve retornar uma lista vazia quando não houver urls criadas por aquele usuário', async () => {
      const user_id = 'user123';

      jest.spyOn(brokerService, 'sendMessage').mockResolvedValue([]);

      const result = await controller.getUrlById({ user: { user_id } } as any);
      expect(result).toHaveLength(0);
    });
  });

  describe('getUrlByShortUrl', () => {
    it('deve redirecionar para a url original', async () => {
      const short_url = 'short1';
      const user_id = 'user123';
      const mockResponse = { redirect: jest.fn() };

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockResolvedValue({ original_url: 'http://example.com' });

      await controller.getUrlByShortUrl(
        short_url,
        { user: { user_id } } as any,
        mockResponse as unknown as Response,
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith('http://example.com');
    });

    it('deve lidar com erros quando a url for inválida', async () => {
      const short_url = 'invalid_short';
      const user_id = 'user123';
      const mockResponse = { redirect: jest.fn() };

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockRejectedValue(new Error('Url encurtada não encontrada'));

      try {
        await controller.getUrlByShortUrl(
          short_url,
          { user: { user_id } } as any,
          mockResponse as unknown as Response,
        );
      } catch (error) {
        expect(error.message).toBe('Url encurtada não encontrada');
      }
    });
  });

  describe('updateUrl', () => {
    it('deve atualizar a url encurtada', async () => {
      const updateUrlDto: UpdateUrlDto = { original_url: 'http://new-url.com' };
      const user_id = 'user123';
      const url_id = 'url123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockResolvedValue({ original_url: 'http://new-url.com' });

      const result = await controller.updateUrl(
        { url_id } as UrlIdDto,
        updateUrlDto,
        { user: { user_id } } as any,
      );
      expect(result.original_url).toBe('http://new-url.com');
    });

    it('deve lidar com erros quando atualizar a url', async () => {
      const updateUrlDto: UpdateUrlDto = {
        original_url: 'http://invalid-url.com',
      };
      const user_id = 'user123';
      const url_id = 'url123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockRejectedValue(new Error('Update falhou'));

      try {
        await controller.updateUrl({ url_id } as UrlIdDto, updateUrlDto, {
          user: { user_id },
        } as any);
      } catch (error) {
        expect(error.message).toBe('Update falhou');
      }
    });
  });

  describe('deleteUrl', () => {
    it('deve deletar a url', async () => {
      const user_id = 'user123';
      const url_id = 'url123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockResolvedValue({ original_url: 'http://example.com' });

      const result = await controller.deleteUrl(
        { url_id } as UrlIdDto,
        { user: { user_id } } as any,
      );
      expect(result.original_url).toBe('http://example.com');
    });

    it('deve lidar com erros quando deletar a url', async () => {
      const user_id = 'user123';
      const url_id = 'url123';

      jest
        .spyOn(brokerService, 'sendMessage')
        .mockRejectedValue(new Error('Delete falhou'));

      try {
        await controller.deleteUrl(
          { url_id } as UrlIdDto,
          { user: { user_id } } as any,
        );
      } catch (error) {
        expect(error.message).toBe('Delete falhou');
      }
    });
  });
});
