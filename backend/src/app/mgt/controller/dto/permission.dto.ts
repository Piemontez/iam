import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { Permission } from '../../../../model/Permission';
import { EntityProps, FindProps } from '../../types/crud.controller';

// DTO find Permission
@Exclude()
export class FindPermissionPropsDto extends FindProps<Permission> {
  @Expose()
  where?: Partial<Permission> | any;

  @Expose()
  @Type(() => String)
  @IsIn(['roles', 'createdBy', 'updatedBy'], { each: true })
  populate?: Array<string>;
}

@Exclude()
class PermissionCreateDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  initials: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;
}

// DTO create Permission
export class EntityPermissionCreateDto extends EntityProps<PermissionCreateDto> {
  @Type(() => PermissionCreateDto)
  entity: Partial<PermissionCreateDto>;
}

@Exclude()
class PermissionUpdateDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  uuid: string;

  @Expose()
  @IsString()
  @IsOptional()
  initials?: string;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;
}

// DTO update Permission
export class EntityPermissionUpdateDto extends EntityProps<PermissionUpdateDto> {
  @Type(() => PermissionUpdateDto)
  entity: Partial<PermissionUpdateDto>;
}
