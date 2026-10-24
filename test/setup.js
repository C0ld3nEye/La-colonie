/**
 * Setup global pour les tests Vitest
 * Mock Phaser pour les tests unitaires
 */

import { vi } from 'vitest';

// Mock Phaser
const mockPhaser = {
    Game: class Game {
        constructor(config) {
            this.config = config;
            this.scenes = new Map();
            this.scale = { resize: vi.fn() };
        }
    },
    Scene: class Scene {
        constructor(config) {
            this.config = config;
            this.children = { add: vi.fn() };
            this.cameras = { main: {
                setBackgroundColor: vi.fn(),
                setBounds: vi.fn(),
                setZoom: vi.fn(),
                centerOn: vi.fn(),
                scrollX: 0,
                scrollY: 0,
                width: 800,
                height: 600
            } };
            this.input = {
                setDefaultCursor: vi.fn(),
                on: vi.fn(),
                pointers: []
            };
            this.add = {
                rectangle: vi.fn((x, y, w, h, color) => ({
                    setOrigin: vi.fn(),
                    setStrokeStyle: vi.fn(),
                    setInteractive: vi.fn(),
                    on: vi.fn(),
                    x, y, w, h, color
                })),
                image: vi.fn((x, y, key) => ({
                    setScale: vi.fn(),
                    setOrigin: vi.fn()
                })),
                text: vi.fn((x, y, text, style) => ({
                    setOrigin: vi.fn(),
                    setDepth: vi.fn()
                })),
                group: vi.fn(() => ({
                    add: vi.fn(),
                    destroy: vi.fn()
                })),
                circle: vi.fn((x, y, r, color) => ({
                    setOrigin: vi.fn()
                })),
                tweens: {
                    add: vi.fn()
                },
                time: {
                    delayedCall: vi.fn()
                }
            };
            this.make = {
                graphics: vi.fn(),
                group: vi.fn()
            };
            this.textures = {
                add: vi.fn((key, x, y, w, h) => ({
                    getSourceImage: vi.fn(() => ({
                        getContext: vi.fn(() => ({
                            fillStyle: '',
                            fillRect: vi.fn(),
                            clearRect: vi.fn()
                        }))
                    })),
                    refresh: vi.fn()
                }))
            };
        }
    },
    Math: {
        Clamp: (value, min, max) => Math.min(Math.max(value, min), max),
        Distance: {
            Between: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        }
    },
    Scale: {
        RESIZE: 'resize',
        CENTER_BOTH: 'center-both'
    },
    Types: {
        Games: {} // Pour éviter les erreurs de type
    }
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
        length: 0
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock Phaser global
window.Phaser = mockPhaser;
global.Phaser = mockPhaser;

// Export pour les tests
export { mockPhaser, localStorageMock };
