class Command {
    constructor(language, commandOptions) {

        // Foxxie Client
        this.client = language?.client;

        // Command name
        if (commandOptions?.name) this.name = commandOptions?.name;

        // Command Aliases
        if (commandOptions?.aliases) this.aliases = commandOptions?.aliases;

        // Command Description Callback
        if (commandOptions?.description) this.description = commandOptions?.description;

        // Command Usage
        if (commandOptions?.usage) this.usage = commandOptions?.usage;

        // Command Permissions
        if (commandOptions?.permissions) this.permissions = commandOptions?.permissions;

        // Command Bot Permissions
        if (commandOptions?.botPermissions) this.botPermissions = commandOptions;

        // Command PermissionLevel
        if (commandOptions?.permissionLevel) this.permissionLevel = commandOptions?.permissionLevel;

        // Command Category
        if (commandOptions?.category) this.category = commandOptions?.category;
    }
}

module.exports = Command;