async function getNextSequenceValue(moduleName, db) {
    const countersCollection = db.collection('counters');

    try {
        const result = await countersCollection.findOneAndUpdate(
            { _id: moduleName },
            { $inc: { sequence_value: 1 } },
            {
                returnDocument: 'after',
                upsert: true
            }
        );

        if (!result.sequence_value) {

            await countersCollection.updateOne(
                { _id: moduleName },
                { $set: { sequence_value: 1 } }
            );
            return 1;
        }

        return result.sequence_value;
    } catch (error) {
        console.error(`Error updating sequence for ${moduleName}:`, error);
        throw new Error('Failed to update sequence value');
    }
}

async function rollbackSequenceIncrement(moduleName, db) {
    try {
        const countersCollection = db.collection('counters');
        await countersCollection.updateOne(
            { _id: moduleName },
            { $inc: { sequence_value: -1 } }
        );
        console.log(`Rolled back sequence increment for module: ${moduleName}`);
    } catch (error) {
        console.error(`Failed to rollback sequence increment for ${moduleName}:`, error.message);
    }
}

module.exports = { getNextSequenceValue, rollbackSequenceIncrement };
