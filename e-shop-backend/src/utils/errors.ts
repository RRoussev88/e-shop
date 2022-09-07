export default {
  401: {
    data: null,
    error: {
      status: 401,
      name: 'UnauthorizedError',
      message: 'Unauthorized',
      details: {},
    },
  },
  403: {
    data: null,
    error: {
      status: 403,
      name: 'ForbiddenError',
      message: 'Forbidden',
      details: {},
    },
  },
  404: {
    data: null,
    error: {
      status: 404,
      name: 'NotFoundError',
      message: 'Not Found',
      details: {},
    },
  },
  500: {
    data: null,
    error: {
      status: 500,
      name: 'InternalServerError',
      message: 'Internal Server Error',
    },
  },
}
