export type Point = { x: number; y: number };

export type Stroke = {
    points: Point[];
    color: string;
    width: number;
    userId: string;
};

export type Tool = 'brush';
