import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PayloadToken } from 'src/auth/models/token.model';
import { MongoIdPipe } from 'src/pipes/mongoId/mongoId.pipe';
import { IAuthRequest } from 'types';
import {
  AddPlayerDto,
  CreateMatchDto,
  UpdateMatchDto,
} from '../dtos/matches.dtos';
import { MatchesService } from '../services/matches.service';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get('/')
  @ApiOperation({ summary: 'Obtener todos los partidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de partidos obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  getAllMatches() {
    return this.matchesService.findAll();
  }

  @Get('/:matchId')
  @ApiOperation({ summary: 'Obtener partido por ID' })
  @ApiParam({ name: 'matchId', description: 'ID del partido' })
  @ApiResponse({ status: 200, description: 'Partido obtenido exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  getMatchById(@Param('matchId', MongoIdPipe) matchId: string) {
    return this.matchesService.findOne(matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiOperation({ summary: 'Crear partido' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({ status: 201, description: 'Partido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  createMatch(@Req() request: IAuthRequest, @Body() payload: CreateMatchDto) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.create(sub, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:matchId')
  @ApiOperation({ summary: 'Actualizar partido' })
  @ApiBearerAuth()
  @ApiParam({ name: 'matchId', description: 'ID del partido' })
  @ApiBody({ type: UpdateMatchDto })
  @ApiResponse({
    status: 200,
    description: 'Partido actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  updateMatch(
    @Param('matchId', MongoIdPipe) matchId: string,
    @Body() payload: UpdateMatchDto,
    @Req() request: IAuthRequest,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.update(sub, matchId, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:matchId')
  @ApiOperation({ summary: 'Eliminar partido' })
  @ApiBearerAuth()
  @ApiParam({ name: 'matchId', description: 'ID del partido' })
  @ApiResponse({ status: 200, description: 'Partido eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  deleteMatch(
    @Param('matchId', MongoIdPipe) matchId: string,
    @Req() request: IAuthRequest,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.delete(sub, matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:matchId/players')
  @ApiOperation({ summary: 'Agregar jugador al partido' })
  @ApiBearerAuth()
  @ApiParam({ name: 'matchId', description: 'ID del partido' })
  @ApiBody({ type: AddPlayerDto })
  @ApiResponse({ status: 201, description: 'Jugador agregado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  addPlayerToMatch(
    @Req() request: IAuthRequest,
    @Param('matchId', MongoIdPipe) matchId: string,
    @Body() payload: AddPlayerDto,
  ) {
    const { sub } = request.user as PayloadToken;
    const { team, ...player } = payload;
    return this.matchesService.addPlayerToMatch(matchId, team, {
      _id: sub,
      ...player,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:matchId/players')
  @ApiOperation({ summary: 'Eliminar jugador del partido' })
  @ApiBearerAuth()
  @ApiParam({ name: 'matchId', description: 'ID del partido' })
  @ApiResponse({ status: 200, description: 'Jugador eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  removePlayerFromMatch(
    @Req() request: IAuthRequest,
    @Param('matchId', MongoIdPipe) matchId: string,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.removePlayerFromMatch(matchId, sub);
  }
}
