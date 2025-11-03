"use client";

import { useState, useRef } from 'react'
import { X, ImageIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { updateProfileAction } from '@/actions/profile/update-profile'
import { useForm } from '@/hooks/use-form'
import type { MemberProfile } from '@/types/member'
import type { UpdateProfileFormData, UpdateProfileFormState } from '@/formdata/profile/update-profile'

const initialState: UpdateProfileFormState = {
  success: false,
  message: '',
}

interface EditProfileFormProps {
  member: MemberProfile
}

export function EditProfile({ member }: EditProfileFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { state, formAction, pending } = useForm<UpdateProfileFormData>({
    action: updateProfileAction,
    initialState,
    loadingMessage: "Updating your profile...",
    successRedirect: `/profile/${member.id}`,
    awaitSession: true,
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  const handleClearImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setImagePreview(null);
  }

  const displayImage = imagePreview || (state.inputs?.image ?? member.image ?? '');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Edit Profile
          </h1>
          <p className="text-muted-foreground text-sm">Update your profile information</p>
        </div>
        <Link href={`/profile/${member.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <Card className="bg-card border border-border shadow-lg">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Image Preview and URL Input */}
            <div className="space-y-4">
              <Label htmlFor="image" className="text-base font-semibold">
                Profile Image
              </Label>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="relative inline-block">
                    <Avatar className="h-32 w-32 rounded-full ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                      {displayImage ? (
                        <AvatarImage
                          src={displayImage}
                          alt="Profile preview"
                          className="h-full w-full object-cover rounded-full"
                          onError={() => setImagePreview(null)}
                        />
                      ) : (
                        <AvatarFallback className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary-foreground text-3xl font-bold rounded-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {displayImage && (
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
                        aria-label="Clear image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Image URL Input */}
                <div className="flex-1 space-y-2">
                  <Input
                    ref={imageInputRef}
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    defaultValue={
                      !state.success
                        ? state.inputs?.image ?? member.image ?? ''
                        : member.image ?? ''
                    }
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to your profile image
                  </p>
                  {state.errors?.image && (
                    <p className="text-sm text-red-600 mt-1">
                      {state.errors.image[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-semibold">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={500}
                placeholder="Tell us about yourself..."
                defaultValue={
                  !state.success
                    ? state.inputs?.bio ?? member.bio ?? ''
                    : member.bio ?? ''
                }
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                {state.errors?.bio ? (
                  <p className="text-sm text-red-600">{state.errors.bio[0]}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {((state.inputs?.bio ?? member.bio ?? '').length)}/500 characters
                  </p>
                )}
              </div>
            </div>

            {/* Location and Website Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, Country"
                  maxLength={100}
                  defaultValue={
                    !state.success
                      ? state.inputs?.location ?? member.location ?? ''
                      : member.location ?? ''
                  }
                />
                {state.errors?.location && (
                  <p className="text-sm text-red-600">
                    {state.errors.location[0]}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base font-semibold">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  defaultValue={
                    !state.success
                      ? state.inputs?.website ?? member.website ?? ''
                      : member.website ?? ''
                  }
                />
                {state.errors?.website && (
                  <p className="text-sm text-red-600">
                    {state.errors.website[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href={`/profile/${member.id}`}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                >
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <span className="mr-2">Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

