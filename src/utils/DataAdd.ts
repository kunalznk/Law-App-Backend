const fs = require('fs');
const path = require('path');
import { ChapterModel, LawModel, SectionModel } from "../models/newLawModel";

const insertLawsFromFolder = async (folderPath) => {
    try {
      const files = fs.readdirSync(folderPath);
  
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(folderPath, file);
          const rawData = fs.readFileSync(filePath);
          const jsonData = JSON.parse(rawData);
        importData(jsonData)
          console.log(`Inserted law from file: ${file}`);
        }
      }
  
      console.log('Insertion completed!');
    } catch (error) {
      console.error('Error inserting laws:', error);
    } finally {
    }
  };
  
export default insertLawsFromFolder


async function importData(data) {
    try {
        if (!data || !data.title || !data.description || !data.tags || !data.summary || !data.chapters) {
            console.error('Invalid data format. Missing required properties.');
            return;
        }

        // Create a Law instance
        const lawInstance = new LawModel({
            title: data.title,
            description: data.description,
            tags: data.tags,
            summary: data.summary
        });

        // Save the Law instance to get its _id
        const savedLaw = await lawInstance.save();

        // Loop through chapters
        for (const chapterData of data.chapters) {
            if (!chapterData || !chapterData.title || !chapterData.sections) {
                console.error('Invalid chapter data format. Missing required properties.');
                continue;
            }

            // Create a Chapter instance with reference to the Law document
            const chapterInstance = new ChapterModel({
                title: chapterData.title,
                law: savedLaw._id
            });

            // Save the Chapter instance to get its _id
            const savedChapter = await chapterInstance.save();

            // Loop through sections
            for (const sectionData of chapterData.sections) {
                if (!sectionData || !sectionData.longTitle || !sectionData.shortTitle) {
                    console.error('Invalid section data format. Missing required properties.');
                    continue;
                }

                // Create a Section instance with references to the Law and Chapter documents
                const sectionInstance = new SectionModel({
                    longTitle: sectionData.longTitle,
                    Bare_Act: sectionData.Bare_Act || [],
                    Simplified_Act: sectionData.Simplified_Act || [],
                    Explanation_using_Example: sectionData.Explanation_using_Example || [],
                    shortTitle: sectionData.shortTitle,
                    law: savedLaw._id,
                    chapter: savedChapter._id
                });

                // Save the Section instance
                await sectionInstance.save();
            }
        }

        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        // Disconnect from the MongoDB database
        // mongoose.disconnect();
    }
}


