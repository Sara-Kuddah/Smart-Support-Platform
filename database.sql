-- Schema for Smart Support Platform
-- Create the proposals table

CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    "aiReview" TEXT,
    
    -- Section A: Entity Data
    "entityType" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    city TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    "responsibleName" TEXT NOT NULL,
    "nationalId" TEXT,
    
    -- Section C: Project Data
    "projectTitle" TEXT NOT NULL,
    "projectDesc" TEXT NOT NULL,
    beneficiaries TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    "fundingAmount" NUMERIC NOT NULL,
    "budgetBreakdown" TEXT NOT NULL,
    "expectedOutcomes" TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Allow public to submit proposals (Insert only)
CREATE POLICY "Enable insert for everyone" ON public.proposals 
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated admins to view/manage all proposals
-- (Note: In a production environment, you would use specific roles)
CREATE POLICY "Enable all for authenticated users" ON public.proposals 
    FOR ALL 
    USING (true);