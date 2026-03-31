// Vehicle types
export type VehicleType =
  | 'car'
  | 'motorcycle'
  | 'truck'
  | 'bus'
  | 'van'
  | 'bicycle'
  | 'other';

// Report status
export type ReportStatus = 'pending' | 'verified' | 'rejected';

// Infraction types
export interface Infraction {
  id: string;
  code: string;
  name: string;
  description: string;
  fineAmount: number;
  points: number;
  category: string;
}

// Evidence
export interface Evidence {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    mimeType?: string;
  };
  uploadedAt: string;
}

// Location
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// Reporter info (minimal, for privacy)
export interface ReporterInfo {
  id: string;
  displayName: string;
  avatar?: string;
  totalReports: number;
  verifiedReports: number;
}

// Report summary (for lists and markers)
export interface ReportSummary {
  id: string;
  shortId: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  infraction: string;
  infractionCode: string;
  status: ReportStatus;
  location: Location;
  thumbnailUrl?: string;
  createdAt: string;
}

// Report marker (for map display)
export interface ReportMarker {
  id: string;
  shortId: string;
  latitude: number;
  longitude: number;
  infraction: string;
  vehiclePlate: string;
  status: ReportStatus;
  createdAt: string;
}

// Full report detail
export interface Report {
  id: string;
  shortId: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  infraction: Infraction;
  status: ReportStatus;
  location: Location;
  description?: string;
  evidence: Evidence[];
  reporter: ReporterInfo;
  verifications: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  reward?: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'cancelled';
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// Report filters for querying
export interface ReportFilters {
  status?: ReportStatus | ReportStatus[];
  vehicleType?: VehicleType | VehicleType[];
  infractionCode?: string | string[];
  city?: string;
  state?: string;
  fromDate?: string;
  toDate?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in km
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'status' | 'infraction';
  sortOrder?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Create report request
export interface CreateReportRequest {
  vehiclePlate: string;
  vehicleType: VehicleType;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  infractionCode: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  evidenceIds: string[];
}

// Verification vote
export interface VerificationVote {
  reportId: string;
  vote: 'up' | 'down';
  reason?: string;
}
