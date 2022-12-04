import { UserRefreshToken } from '../../database/models';

export async function getUserTokens(data: {
    userId: number;
}): Promise<UserRefreshToken[]> {
    const user = await UserRefreshToken.findAll({
        where: { ...data },
    });

    if (!user) {
        throw Error('USER NOT FOUND');
    }
    return user;
}
