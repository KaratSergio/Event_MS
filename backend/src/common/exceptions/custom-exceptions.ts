import { HttpException, HttpStatus } from '@nestjs/common';

export class EventFullException extends HttpException {
  constructor() {
    super('Event is full', HttpStatus.CONFLICT);
  }
}

export class AlreadyJoinedException extends HttpException {
  constructor() {
    super('Already joined this event', HttpStatus.CONFLICT);
  }
}

export class PastDateException extends HttpException {
  constructor() {
    super('Cannot create/edit event in the past', HttpStatus.BAD_REQUEST);
  }
}

export class NotOrganizerException extends HttpException {
  constructor() {
    super('Only organizer can perform this action', HttpStatus.FORBIDDEN);
  }
}

export class EventNotFoundException extends HttpException {
  constructor() {
    super('Event not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidCapacityException extends HttpException {
  constructor() {
    super('Capacity must be >= 1 or null', HttpStatus.BAD_REQUEST);
  }
}

export class CannotJoinOwnEventException extends HttpException {
  constructor() {
    super('Organizer cannot join their own event', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class NotParticipantException extends HttpException {
  constructor() {
    super('Not a participant of this event', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super('User with this email already exists', HttpStatus.CONFLICT);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class TagNotFoundException extends HttpException {
  constructor(id?: string) {
    super(id ? `Tag with ID ${id} not found` : 'Tag not found', HttpStatus.NOT_FOUND);
  }
}

export class TagAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Tag with name "${name}" already exists`, HttpStatus.CONFLICT);
  }
}

export class TagNameRequiredException extends HttpException {
  constructor() {
    super('Tag name is required', HttpStatus.BAD_REQUEST);
  }
}