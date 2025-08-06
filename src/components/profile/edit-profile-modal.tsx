'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { updateProfileAction } from '@/actions/profile/update-profile'
import type { UserProfile } from '@/types/user'
import type { UpdateProfileFormState } from '@/models/profile/update-profile'
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { authClient } from '@/lib/auth-client'

const initialState: UpdateProfileFormState = {
  success: false,
  message: '',
}

export function EditProfileModal({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false)
  const { refetch } = authClient.useSession();
  
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  )

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? 'Saved successfully')
      refetch()
      setOpen(false)
    } 
  }, [state.success, state.resetKey, state.message, refetch]) 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Change your details below.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-6">
          {/* Image URL */}
          <div>
            <Label htmlFor="image">User Image</Label>
            <Input
              id="image"
              name="image"
              defaultValue={
                !state.success
                  ? state.inputs?.image ?? user.image ?? ''
                  : user.image ?? ''
              }
            />
            {state.errors?.image && (
              <p className="text-sm text-red-600">{state.errors.image[0]}</p>
            )}
          </div>
          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={500}
              defaultValue={
                !state.success
                  ? state.inputs?.bio ?? user.bio ?? ''
                  : user.bio ?? ''
              }
            />
            {state.errors?.bio && (
              <p className="text-sm text-red-600">{state.errors.bio[0]}</p>
            )}
          </div>
          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              maxLength={100}
              defaultValue={
                !state.success
                  ? state.inputs?.location ?? user.location ?? ''
                  : user.location ?? ''
              }
            />
            {state.errors?.location && (
              <p className="text-sm text-red-600">
                {state.errors.location[0]}
              </p>
            )}
          </div>
          {/* Website */}
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={
                !state.success
                  ? state.inputs?.website ?? user.website ?? ''
                  : user.website ?? ''
              }
            />
            {state.errors?.website && (
              <p className="text-sm text-red-600">
                {state.errors.website[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
