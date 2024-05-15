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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/pipes/mongoId/mongoId.pipe';
import {
  AddPlayerDto,
  CreateMatchDto,
  UpdateMatchDto,
} from '../dtos/matches.dtos';
import { MatchesService } from '../services/matches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PayloadToken } from 'src/auth/models/token.model';
import { IAuthRequest } from 'types';

@ApiTags('Matches')
@Controller('Matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}
  // get match by id
  @Get('/:matchId')
  @ApiOperation({ summary: 'Get match by id' })
  getFieldById(@Param('matchId', MongoIdPipe) matchId: string) {
    return this.matchesService.findOne(matchId);
  }

  // create match
  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create match' })
  createField(@Req() request: IAuthRequest, @Body() payload: CreateMatchDto) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.create(sub, payload);
  }

  // update match
  @UseGuards(JwtAuthGuard)
  @Put('/:matchId')
  @ApiOperation({ summary: 'Update match' })
  updateField(
    @Req() request: IAuthRequest,
    @Param('matchId', MongoIdPipe) matchId: string,
    @Body() payload: UpdateMatchDto,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.update(sub, matchId, payload);
  }

  // delete match
  @UseGuards(JwtAuthGuard)
  @Delete('/:matchId')
  @ApiOperation({ summary: 'Delete match' })
  deleteField(
    @Req() request: IAuthRequest,
    @Param('matchId', MongoIdPipe) matchId: string,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.delete(sub, matchId);
  }

  // add player to match
  @UseGuards(JwtAuthGuard)
  @Put('/:matchId/players')
  @ApiOperation({ summary: 'Add player to match' })
  addPlayerToField(
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

  // remove player from match
  @UseGuards(JwtAuthGuard)
  @Delete('/:matchId/players')
  @ApiOperation({ summary: 'Remove player from match' })
  removePlayerFromField(
    @Req() request: IAuthRequest,
    @Param('matchId', MongoIdPipe) matchId: string,
  ) {
    const { sub } = request.user as PayloadToken;
    return this.matchesService.removePlayerFromMatch(matchId, sub);
  }
}
