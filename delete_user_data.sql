-- Add delete_user_data RPC function
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all business ownerships for this user
  DELETE FROM business_owners WHERE user_id = $1;
  
  -- Delete all businesses owned solely by this user
  -- (This will cascade delete related bookings due to foreign key constraints)
  DELETE FROM businesses b
  WHERE NOT EXISTS (
    SELECT 1 FROM business_owners bo
    WHERE bo.business_id = b.id
  );
  
  -- If there are any other user-specific tables, delete data from them here
  
  -- Note: The actual user account in auth.users will be deleted by the edge function
END;
$$;
