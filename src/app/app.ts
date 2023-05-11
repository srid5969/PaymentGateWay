import { acFilterAttributes } from '@leapjs/access-control';
import { LeapApplication, MongoDB } from '@leapjs/core';
import { ExpressAdapter } from '@leapjs/router';
import { AuthMiddleware } from 'common/middleware/access';
import { AccessTokenGeneratorForRefreshToken } from 'common/userSession/controller/userSession';
import { Configuration } from 'configuration/manager';
import { json } from 'express-mung';
import helmet from 'helmet';
import { UserController } from 'app/user/controller/user';
import morgan from 'morgan';


export default async function bootstrap(
    configuration: Configuration,
    listen = true,
  ): Promise<void> {
    const application: LeapApplication = new LeapApplication();

const server = application.create(new ExpressAdapter(), {
    // prefix: '/api',
    corsOptions: {
      origin: configuration.corsWhitelistedDomains,
      credentials: true,
    },
    controllers: [AccessTokenGeneratorForRefreshToken,UserController],
    beforeMiddlewares: [helmet(), json(acFilterAttributes),AuthMiddleware,morgan('dev')],
    afterMiddlewares: [],
  });
  application.connectToDatabase(
    new MongoDB(configuration.database.host, configuration.database.name),
  );
  server.listen(configuration.port);

}
