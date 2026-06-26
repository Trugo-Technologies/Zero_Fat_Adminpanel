import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';
import { ICategories } from '../../nutriplan/categories';

export interface ITrainersListDto extends IBaseResponseListDto<ITrainer> {}

export interface ICreateTrainerDto {
  nameAr: string;
  nameEn: string;
  briefAr: string;
  briefEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: string;
  specialisesIn: Array<string>;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  youtubeUrl: string;
  websiteUrl: string;

  avatarImage: string;
  profileMedia: string;

  isActive: boolean;
}

export interface IUpdateTrainerDto extends IBaseUpdateDto, ICreateTrainerDto {
  avatarImageUrl?: string;
  profileMediaUrl?: string;
}

export interface ITrainerDetailsDto extends IBaseResponseDetailsDto<ITrainer> {}

export interface ITrainer extends IBaseAdditionalResponseDetailsDto {
  id: string;
  nameAr: string;
  nameEn: string;
  briefAr: string;
  briefEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: string;
  specialisesIn: Array<string>;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  youtubeUrl: string;
  websiteUrl: string;

  avatarImage: string;
  avatarImageUrl: string;
  profileMedia: string;
  profileMediaUrl: string;

  isActive: boolean;
}
