import Expo from 'expo-server-sdk';
import { expo } from './config';

// interface for push tokens
export interface PushToken {
    expo_push_token: string;
}

const messages = [];

// send push notification
export const sendPushNotification = async (pushTokens: PushToken[], message: string) => {
	try {
		for (const token of pushTokens) {
			if (!Expo.isExpoPushToken(token)) continue;

			messages.push({
				to: token.expo_push_token,
				sound: 'default',
				body: message,
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
