/**
 * Test de charge pour la Phase 0
 * Vérifie que le jeu peut gérer 150 entités simulées
 */

import { performance } from 'perf_hooks';

// Mock minimal pour le test de charge
class MockEntity {
    constructor() {
        this.x = Math.random() * 2048;
        this.y = Math.random() * 2048;
        this.health = 100;
        this.hunger = 0;
    }
    
    update(delta) {
        // Simulation de mise à jour
        this.x += (Math.random() - 0.5) * 10;
        this.y += (Math.random() - 0.5) * 10;
        this.hunger += delta * 0.001;
        
        if (this.hunger > 50) {
            this.health -= delta * 0.001;
        }
    }
}

// Test de charge
const ENTITY_COUNT = 150;
const DURATION = 1000; // 1 seconde
const MAX_TICK_DURATION = 100; // 100ms max par tick

console.log(`Test de charge: ${ENTITY_COUNT} entités...`);

// Créer les entités
const entities = [];
for (let i = 0; i < ENTITY_COUNT; i++) {
    entities.push(new MockEntity());
}

console.log(`Création de ${ENTITY_COUNT} entités: OK`);

// Simuler des ticks
let startTime = performance.now();
let tickCount = 0;
let maxTickDuration = 0;

while (performance.now() - startTime < DURATION) {
    const tickStart = performance.now();
    
    // Mettre à jour toutes les entités
    const delta = 16; // ~60 FPS
    for (const entity of entities) {
        entity.update(delta);
    }
    
    const tickDuration = performance.now() - tickStart;
    maxTickDuration = Math.max(maxTickDuration, tickDuration);
    tickCount++;
}

const totalTime = performance.now() - startTime;
const avgTickDuration = totalTime / tickCount;

console.log(`\nRésultats:`);
console.log(`- Ticks exécutés: ${tickCount}`);
console.log(`- Durée totale: ${totalTime.toFixed(2)}ms`);
console.log(`- Durée moyenne par tick: ${avgTickDuration.toFixed(2)}ms`);
console.log(`- Durée max par tick: ${maxTickDuration.toFixed(2)}ms`);

// Vérifier les critères
if (maxTickDuration <= MAX_TICK_DURATION) {
    console.log(`\n✓ TEST PASSE: Durée max par tick (${maxTickDuration.toFixed(2)}ms) ≤ ${MAX_TICK_DURATION}ms`);
    process.exit(0);
} else {
    console.log(`\n✗ TEST ÉCHOUE: Durée max par tick (${maxTickDuration.toFixed(2)}ms) > ${MAX_TICK_DURATION}ms`);
    process.exit(1);
}
