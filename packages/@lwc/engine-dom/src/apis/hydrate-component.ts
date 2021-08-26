/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import {
    createVM,
    getComponentInternalDef,
    LightningElement,
    hydrateRootElement,
} from '@lwc/engine-core';
import { isFunction, isNull, isObject } from '@lwc/shared';
import { renderer, setIsHydrating } from '../renderer';

export function hydrateComponent(
    element: Element,
    Ctor: typeof LightningElement,
    props: { [name: string]: any } = {}
) {
    if (!isFunction(Ctor)) {
        throw new TypeError(
            `"hydrateComponent" expects a valid component constructor as the second parameter but instead received ${Ctor}.`
        );
    }

    if (!isObject(props) || isNull(props)) {
        throw new TypeError(
            `"hydrateComponent" expects an object as the third parameter but instead received ${props}.`
        );
    }

    const def = getComponentInternalDef(Ctor);

    // For now, an honest hack so it does not replace the existing shadowRoot in renderer.attachShadow
    setIsHydrating(true);

    createVM(element, def, {
        mode: 'open',
        owner: null,
        renderer,
        tagName: element.tagName.toLowerCase(),
    });

    for (const [key, value] of Object.entries(props)) {
        (element as any)[key] = value;
    }

    hydrateRootElement(element);

    // set it back since now we finished hydration.
    setIsHydrating(false);
}