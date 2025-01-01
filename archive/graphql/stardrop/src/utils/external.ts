/**
 * # The MIT License (MIT)
Copyright © `2019` `Favware`
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
import { FieldsByTypeName, parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { createParamDecorator } from 'type-graphql';
import type { SetIntersection, ValuesType } from 'utility-types';

function infoIsResolveTree(info?: ResolveTree | FieldsByTypeName | null): info is ResolveTree {
    if (!info) return false;
    return (info as ResolveTree).fieldsByTypeName !== undefined;
}

function collectRequestedFields(fieldsToParse: Record<string, ResolveTree>, collectedFields: Set<string> = new Set(), parent = ''): Set<string> {
    for (const fieldValue of Object.values(fieldsToParse)) {
        if (Object.keys(fieldValue.fieldsByTypeName).length === 0) {
            if (parent && !collectedFields.has(parent)) collectedFields.add(parent);
            collectedFields.add(`${parent ? `${parent}.` : ''}${fieldValue.name}`);
        } else {
            collectRequestedFields(Object.values(fieldValue.fieldsByTypeName)[0], collectedFields, `${parent ? `${parent}.` : ''}${fieldValue.name}`);
        }
    }
    return collectedFields;
}

export function getRequestedFields(): ParameterDecorator {
    return createParamDecorator(({ info }) => {
        const resolvedInfo = parseResolveInfo(info, { deep: true });

        if (infoIsResolveTree(resolvedInfo)) {
            return collectRequestedFields(Object.values(resolvedInfo.fieldsByTypeName)[0]);
        }

        return new Set<string>();
    });
}

export function addPropertyToClass<T, K extends keyof T>(
    classTarget: T,
    propertyKey: K,
    propertyValue: SetIntersection<ValuesType<T>, T[K]>,
    requestedFields: Set<K>,
    fieldAccessor = propertyKey as string
): T {
    if (requestedFields.has(fieldAccessor as K)) classTarget[propertyKey] = propertyValue;

    return classTarget;
}
