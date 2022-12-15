import Expo from 'expo-server-sdk';
import { expo } from './config';

// interface for push tokens
export interface PushToken {
    expo_push_token: string;
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

		const tickets = [];
		for (const chunk of chunks) {
			try {
				const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				console.log(ticketChunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		console.log(error);
	}
};
