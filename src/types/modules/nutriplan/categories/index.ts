import { IBaseUpdateDto, IBaseResponseDetailsDto, IBaseResponseListDto, IBaseAdditionalResponseDetailsDto } from 'src/types/baseEntity';

export interface ICategoriesListDto extends IBaseResponseListDto<ICategories> { }

export interface ICreateCategoriesDto {
    nameAr: string;
    nameEn: string;
    icon: string | File
    image: string | File
    categoryType: string
}

export interface IUpdateCategoryDto extends IBaseUpdateDto, ICreateCategoriesDto { }

export interface ICategoriesDetailsDto extends IBaseResponseDetailsDto<ICategories> { }

export interface ICategories extends IBaseAdditionalResponseDetailsDto {
    id: string;
    nameAr: string;
    nameEn: string;
    iconUrl: string | null
    imageUrl: string | null
    categoryType: string
}
