import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiOperation,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/utils/enums";
import {
  UserResponseDto,
  UsersResponseDto,
  UserCreatedResponseDto,
  UserUpdatedResponseDto,
} from "./dto/user-response.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { UserDto } from "./dto/user.dto";
import { PageDto, PageOptionsDto } from "src/common/dtos";

@ApiTags("User")
@Controller("user")
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Create a user", security: [] })
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: UserCreatedResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("paginate")
  @Roles(UserRole.ADMIN)
  @ApiPaginatedResponse(UserDto)
  async findUsersPaginated(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.findUsersPaginated(pageOptionsDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiOkResponse({ type: UsersResponseDto })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user" })
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "User ID",
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    type: UserUpdatedResponseDto,
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(":id")
  @HttpCode(200)
  @ApiOperation({ summary: "Remove a user" })
  @ApiOkResponse({
    description: "User was successfully removed",
    example: { message: "User with ID 5 was successfully removed" },
  })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
