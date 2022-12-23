import { IncomingHttpHeaders } from 'http';
import { getTokensFromHeaders, RefreshTokenPayload } from '../helpers';
import jwt from 'jsonwebtoken';
import { config } from '../../../../config';

export async function verifyUserTokens(data: saveNewUserType) {
    const { authenticationToken } = getTokensFromHeaders(data.headers);
    const { authenticationTokenSecret } = config.secrets;

    const { payload } = jwt.verify(
        authenticationToken,
        authenticationTokenSecret
    ) as {
        payload: RefreshTokenPayload;
    };

    return payload;
}

type saveNewUserType = { headers: IncomingHttpHeaders };
