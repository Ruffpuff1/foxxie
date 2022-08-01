import { Entity } from '@assets/arts-and-culture/structures/Entity';
import { searchTerms } from '../searching';
import peopleData from './Entities.people.json';
import locationData from './Entities.locations.json';
import figureData from './Entities.figures.json';

export const entities: Entity[] = [];

for (const entityData of peopleData.entities) {
    const entity = new Entity(entityData as Entity);
    entities.push(entity);
    searchTerms.set(entity.name, entity);
}

for (const entityData of locationData.entities) {
    const entity = new Entity(entityData as Entity);
    entities.push(entity);
    searchTerms.set(entity.name, entity);
}

for (const entityData of figureData.entities) {
    const entity = new Entity(entityData as Entity);
    entities.push(entity);
    searchTerms.set(entity.name, entity);
}
