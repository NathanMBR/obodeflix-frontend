import { UserTypes } from "./User";

export namespace Comment {
    interface Owner {
        readonly id: number;
        readonly name: string;
        readonly type: UserTypes;
    }

    interface Base {
        readonly id: number;
    
        readonly userId: number;
        readonly body: string;
    
        readonly parentId: number | null;
        readonly seriesId: number | null;
        readonly episodeId: number | null;
    
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly deletedAt: Date | null;

        readonly user: Owner;
    }

    export interface Child extends Base {}

    export interface Parent extends Base {
        readonly children: Array<Child>;
    }
}