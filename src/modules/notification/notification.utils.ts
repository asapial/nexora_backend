export const currentUserNotificationWhere = (userId: string, notificationId: string) => ({
  id: notificationId,
  userId,
});
