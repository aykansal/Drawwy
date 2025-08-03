export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface PixelArt {
  id: string;
  name: string;
  grid: string[][];
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface DrawingState {
  grid: string[][];
  selectedColor: string;
  isDrawing: boolean;
  isErasing: boolean;
}

export interface HistoryState {
  past: string[][][];
  present: string[][];
  future: string[][][];
}

export interface PaletteColor {
  color: string;
  name: string;
}

export type GridSize = 8 | 16 | 32 | 64;

export interface ExportOptions {
  format: 'png' | 'json';
  filename?: string;
  scale?: number;
}

export interface ExportHistory {
  id: string;
  creatorName: string;
  turboLink: string;
  artworkName: string;
  size: number;
  exportedAt: number;
  manifestId?: string; // New field for manifest-based uploads
}

// Manifest-based storage types
export interface ManifestData {
  manifest: string;
  version: string;
  index: {
    path: string;
  };
  paths: Record<string, { id: string }>;
}

export interface PixelArtManifest extends ManifestData {
  manifest: "arweave/paths";
  version: "0.2.0";
  index: {
    path: "image.png";
  };
  paths: {
    "image.png": { id: string };
    "grid-data.json": { id: string };
  };
}

export interface GridDataFile {
  grid: string[][];
  metadata: {
    imageTxId: string;
    creator: string;
    artworkName: string;
    size: number;
    createdAt: string;
  };
}

// Collection types
export interface Collection {
  id: string;
  title: string;
  description: string;
  creator: string;
  dateCreated: string;
  thumbnail: string;
  banner: string;
  assets: string[];
}

export interface CollectionProcessUpdateId {
  id: string;
  status: string;
  timestamp: number;
}

export interface UpdateCollectionAssetsParams {
  collectionId: string;
  assetIds: string[];
  creator: string;
  updateType: "Add" | "Remove";
}

export interface CollectionProcessId {
  id: string;
  status: string;
  timestamp: number;
}

export interface CreateCollectionParams {
  title: string;
  description: string;
  creator: string;
  thumbnail?: string;
  banner?: string;
}

// GraphQL Transaction Types for Drawwy
export interface TransactionTag {
  name: string;
  value: string;
}

export interface TransactionFee {
  ar: string;
}

export interface TransactionQuantity {
  ar: string;
}

export interface TransactionData {
  size: number;
  type: string;
}

export interface TransactionBlock {
  id: string;
  timestamp: number;
  height: number;
}

export interface TransactionOwner {
  address: string;
}

export interface TransactionNode {
  id: string;
  owner: TransactionOwner;
  recipient: string;
  fee: TransactionFee;
  quantity: TransactionQuantity;
  data: TransactionData;
  tags: TransactionTag[];
  block: TransactionBlock;
}

export interface TransactionEdge {
  cursor: string;
  node: TransactionNode;
}

export interface PageInfo {
  hasNextPage: boolean;
}

export interface TransactionsResponse {
  transactions: {
    pageInfo: PageInfo;
    edges: TransactionEdge[];
  };
}

export interface GraphQLQuery {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>;
}

// Creator Collections Types
export interface CreatorCollectionNode {
  id: string;
  owner: TransactionOwner;
  tags: TransactionTag[];
  block: TransactionBlock;
}

export interface CreatorCollectionEdge {
  cursor: string;
  node: CreatorCollectionNode;
}

export interface CreatorCollectionsResponse {
  transactions: {
    pageInfo: PageInfo;
    edges: CreatorCollectionEdge[];
  };
}

export interface CollectionDetails {
  id: string;
  title: string;
  description: string;
  creator: string;
  dateCreated: string;
  thumbnail: string;
  banner: string;
  assets: string[];
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

export interface NavigationConfig {
  items: NavItem[];
  homeIcon: React.ReactNode;
} 