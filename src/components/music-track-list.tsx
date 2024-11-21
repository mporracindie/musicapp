import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PlayIcon, PauseIcon } from "lucide-react"
import Image from "next/image"

// Updated mock data for music tracks with paths to .wav files
const mockTracks = [
  { id: 1, title: "Pachu", tags: ["Electronic", "Chill"], releaseDate: "2023-06-15", path: "https://pub-c41539a57cea4b98b014887e9c78940b.r2.dev/force.wav" }
]

// Mock artist data
const artistData = {
  name: "Jane Doe",
  country: "United States",
  profilePicture: "/placeholder.svg?height=100&width=100",
  bannerImage: "/placeholder.svg?height=200&width=1000",
}

export function MusicTrackListComponent() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState(mockTracks)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("releaseDate")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  useEffect(() => {
    const filteredTracks = mockTracks.filter((track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    )

    const sortedTracks = filteredTracks.sort((a, b) => {
      if (sortBy === "releaseDate") {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

    setTracks(sortedTracks)
  }, [search, sortBy])

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      audioRef.current?.play();
      setCurrentlyPlaying(id);
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "'0'")}`
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full overflow-hidden">
        <div className="relative h-48">
          <Image
            src={artistData.bannerImage}
            alt="Artist banner"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <CardContent className="flex items-center p-6 -mt-16 relative">
          <div className="mr-6">
            <Image
              src={artistData.profilePicture}
              alt={`${artistData.name}'s profile picture`}
              width={100}
              height={100}
              className="rounded-full border-4 border-white dark:border-neutral-950"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{artistData.name}</h1>
            <p className="text-neutral-500 dark:text-neutral-400">{artistData.country}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search tracks or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="releaseDate">Release Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <Card key={track.id} className="w-full">
            <CardContent className="flex items-center p-4">
              <Button
                variant="outline"
                size="icon"
                className="mr-4"
                onClick={() => togglePlay(track.id)}
              >
                {currentlyPlaying === track.id ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                <audio ref={audioRef} src={track.path}/>
              </Button>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{track.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {track.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-neutral-100 text-neutral-900 px-2 py-1 rounded dark:bg-neutral-800 dark:text-neutral-50">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 mt-1 dark:text-neutral-400">
                  Released: {new Date(track.releaseDate).toLocaleDateString()} | Duration: {formatDuration(0)}
                </p>
              </div>
              <div className="w-1/3 ml-4">
                <div className="bg-neutral-100 h-2 rounded-full dark:bg-neutral-800">
                  <div
                    className="bg-neutral-900 h-full rounded-full dark:bg-neutral-50"
                    style={{ width: `${0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}