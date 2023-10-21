import { ArchievedMessages } from "../models/archieved";
import { Message, messageAttributes } from "../models/message";

class CronJobService {
    async runJob() {
      try {
        const messages: messageAttributes[] = await Message.findAll();

        const archivedMessages = messages.map((message) => {
          // Use Object.assign to create a copy of the message without the 'id' property
          const { id, ...archivedData } = message.toJSON(); // Remove 'id' property
        
          return archivedData;
        });

        await ArchievedMessages.bulkCreate(archivedMessages);

        await Message.destroy({where: {}});
      } catch (error) {
        console.log('Error while running cron job service', error);
      }
    }
}

export default new CronJobService();
