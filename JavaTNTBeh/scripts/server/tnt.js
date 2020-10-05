// Server script to handle block breaking

const mySystem = server.registerSystem(0, 0);

const newExplosionTicks = 1;
const queryRadius = 8;

let globals = {
    itemQuery: null,
    explosionCentre: null,
    blocksExploded: [],
    newExplosion: true,
    ticksSinceExplosion: 0
};

const itemDropDifferent = {
    "minecraft:stone": "minecraft:cobblestone",
    "minecraft:grass": "minecraft:dirt",
    "minecraft:crimson_nylium": "minecraft:netherrack",
    "minecraft:warped_nylium": "minecraft:netherrack"
};

const itemNoDrop = [
    "minecraft:tallgrass",
    "minecraft:double_plant",
    "minecraft:red_flower",
    "minecraft:yellow_flower",
    "minecraft:leaves",
    "minecraft:leaves2",
    "minecraft:glass",
    "minecraft:glass_pane"
];


mySystem.initialize = function() {
    globals.itemQuery = this.registerQuery("minecraft:position", "x", "y", "z");
    this.listenForEvent("minecraft:block_exploded", (eventData) => this.blockExploded(eventData));
};

mySystem.update = function() {
    if (!globals.newExplosion)
        globals.ticksSinceExplosion += 1;

    if (globals.ticksSinceExplosion >= newExplosionTicks) {
        this.destroyItems();
        this.dropItems();
        globals.newExplosion = true;
        globals.ticksSinceExplosion = 0;
    }
};

mySystem.blockExploded = function(eventData) {
    let dropName = "";

    // Ensure event data exists
    if (eventData == null || eventData.data == null)
        return;

    let blockName = eventData.data.block_identifier;
    let blockPosition = eventData.data.block_position;

    if (globals.newExplosion) {
        // Record first block as the centre
        globals.explosionCentre = blockPosition;
        globals.newExplosion = false;
        globals.ticksSinceExplosion = 0;
    }

    if (itemNoDrop.includes(blockName))
        return;
    else if (itemDropDifferent[blockName] != null)
        dropName = itemDropDifferent[blockName];
    else
        dropName = blockName;

    // Add block to list
    globals.blocksExploded.push({
        name: dropName,
        position: blockPosition
    });
};

mySystem.destroyItems = function() {
    // Destroy all items dropped in area
    let minX = globals.explosionCentre.x - queryRadius;
    let minY = globals.explosionCentre.y - queryRadius;
    let minZ = globals.explosionCentre.z - queryRadius;
    let maxX = globals.explosionCentre.x + queryRadius;
    let maxY = globals.explosionCentre.y + queryRadius;
    let maxZ = globals.explosionCentre.z + queryRadius;

    let explodedItems = this.getEntitiesFromQuery(globals.itemQuery, minX, minY, minZ, maxX, maxY, maxZ);
    
    for (item in explodedItems) {
        // Only destroy items
        if (explodedItems[item].__type__ == "item_entity")
            this.destroyEntity(explodedItems[item]);
    }
};

mySystem.dropItems = function() {
    // Create all block entities
    for (index in globals.blocksExploded) {
        let currentBlock = globals.blocksExploded[index];
        let blockEntity = this.createEntity("item_entity", currentBlock.name);
    
        let positionComponent = this.getComponent(blockEntity, "minecraft:position");
        if (positionComponent != null) {
            positionComponent.data.x = currentBlock.position.x;
            positionComponent.data.y = currentBlock.position.y;
            positionComponent.data.z = currentBlock.position.z;
        }

        this.applyComponentChanges(blockEntity, positionComponent);
    }

    // Empty the array
    globals.blocksExploded = [];
};