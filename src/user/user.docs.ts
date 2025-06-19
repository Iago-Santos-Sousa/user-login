import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  UserResponseDto,
  UsersResponseDto,
  UserUpdatedResponseDto,
} from "./dto/user-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";

export const CreateUserDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Create a user", security: [] }),
    ApiCreatedResponse({
      description: "The record has been successfully created.",
      type: CreateUserDto,
    }),
  );
};

export const GetAllUsersDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Get all users" }),
    ApiOkResponse({ type: UsersResponseDto }),
  );
};

export const GetUserByIdDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Get a user" }),
    ApiOkResponse({ type: UserResponseDto }),
  );
};

export const UpdateUserByIdDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Update a user" }),
    ApiParam({
      name: "id",
      type: Number,
      description: "User ID",
    }),
    ApiBody({
      type: UpdateUserDto,
    }),
    ApiOkResponse({
      type: UserUpdatedResponseDto,
    }),
  );
};

export const DeleteUserByIdDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Remove a user" }),
    ApiOkResponse({
      description: "User was successfully removed",
      example: { message: "User with ID 5 was successfully removed" },
    }),
  );
};
