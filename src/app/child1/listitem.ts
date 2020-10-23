export interface ListItem {
	/**
	 * Content to be displayed in the list.
	 */
	content: string;
	/**
	 * Flag for the selected state of the item.
	 */
	selected: boolean;
	/**
	 * If the item is in a disabled state.
	 * (Note: not all lists have to support disabled states, and not all lists behave the same with disabled items)
	 */
	disabled?: boolean;
	/**
	 * Optional nested items.
	 */
	items?: ListItem[];

	/**
	 * Allows for any other custom properties to be included in the ListItem
	 */
	[x: string]: any;
}