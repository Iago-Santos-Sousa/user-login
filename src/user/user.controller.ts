/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/common/decorators/skipAuth.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/utils/enums";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { UserDto } from "./dto/user.dto";
import { PageDto, PageOptionsDto } from "src/common/dtos";
import {
  CreateUserDocs,
  GetAllUsersDocs,
  GetUserByIdDocs,
  UpdateUserByIdDocs,
  DeleteUserByIdDocs,
} from "./user.docs";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@ApiTags("User")
@Controller("user")
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(201)
  @CreateUserDocs()
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
  @GetAllUsersDocs()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @GetUserByIdDocs()
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @UpdateUserByIdDocs()
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(":id")
  @HttpCode(200)
  @DeleteUserByIdDocs()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @EventPattern("message")
  messageExample(@Payload() data: any, @Ctx() context: RmqContext) {
    /* 
      {
        "pattern": "message",
        "data": "mensagem"
      } 
    */
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`Data: ${JSON.stringify(data)}`);
    console.log("Canal(conexão): ", context.getChannelRef());
    channel.ack(originalMsg);
  }
}
