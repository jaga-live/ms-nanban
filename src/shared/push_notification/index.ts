import Expo from 'expo-server-sdk';
import { Repository } from '../../database/sql';
import { container } from '../../core/inversify/inversify.config';
import { TYPES } from '../../core/inversify/types';
import { expo } from './config';
import { AuthRepository } from '../../api/auth/repository/auth.repository';

// interface for push tokens
export interface PushToken {
    expo_push_token: string;
}

enum EXPO_ERROR  {
	DeviceNotRegistered = 'DeviceNotRegistered'
}

// send push notification
export const sendPushNotification = async (pushTokens: PushToken[], body: any, message: string) => {
	try {
		const messages = [];

		for (let index = 0; index < pushTokens.length; index++) {
			const token = pushTokens[index].expo_push_token;
			if (!Expo.isExpoPushToken(token)) continue;
			messages.push({
				to: token,
				sound: 'default',
				body: message,
				data: body
			});
		}

		const chunks = expo.chunkPushNotifications(messages);

		for (const chunk of chunks) {
			try {
				const ticketChunk: any = await expo.sendPushNotificationsAsync(chunk);
				console.log(ticketChunk);
				const errInfo: any = ticketChunk[0].details as any;
				
				if (errInfo?.error === EXPO_ERROR.DeviceNotRegistered || errInfo?.fault === 'developer') {
					handleInvalidToken(chunk[0].to as string);
				}
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		// console.log(error);
	}
};

const handleInvalidToken = async (pushToken: string) => {
	const authRepo = container.get<AuthRepository>(AuthRepository);
	await authRepo.delete_expo_push_token_by_token(pushToken);
};
