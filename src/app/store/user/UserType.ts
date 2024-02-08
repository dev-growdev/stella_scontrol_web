import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The type definition for a user object.
 */
export type UserType = {
	uid?: string;
	idUserAd?: string
	role?: string[] | string | null;
	from?: string;
	data: {
		displayName: string;
		photoURL?: string;
		email?: string;
		jobTitle?: string
		shortcuts?: string[];
		settings?: Partial<FuseSettingsConfigType>;
	};
};

export default UserType;
