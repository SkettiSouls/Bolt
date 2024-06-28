import { logger } from '$lib/Util/Logger';
import { onWritableChange } from '$lib/Util/onWritableChange';
import { writable } from 'svelte/store';

export interface Config {
	use_dark_theme: boolean;
	rs_plugin_loader: boolean;
	flatpak_rich_presence: boolean;
	runelite_use_custom_jar: boolean;
	selected_game_index: number;
	selected_client_index: number;
	rs_config_uri?: string;
	runelite_custom_jar?: string;
	selected_account?: string;
	selected_characters?: Map<string, string>; // account userId, then character accountId
	selected_game_accounts?: Map<string, string>; // legacy version of selected_characters
}

export let configHasPendingChanges = false;

const params = new URLSearchParams(window.location.search);
const configParam = params.get('config');
let parsedConfig: Config = {
	use_dark_theme: true,
	rs_plugin_loader: false,
	flatpak_rich_presence: false,
	runelite_use_custom_jar: false,
	selected_characters: new Map(),
	selected_game_accounts: new Map(),
	selected_game_index: 1,
	selected_client_index: 1
};

if (configParam) {
	try {
		parsedConfig = JSON.parse(configParam) as Config;
	} catch (e) {
		logger.error('Unable to parse config, restoring to default');
	}
}

export const config = writable<Config>(parsedConfig);

onWritableChange(config, () => {
	configHasPendingChanges = true;
});
