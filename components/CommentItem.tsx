import { MoreHorizontal, Trash2 } from "lucide-react"

interface CommentItemProps {
  id: string
  avatar: string
  username: string
  timestamp: string
  content: string
}

export function CommentItem({ avatar, username, timestamp, content }: CommentItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-lg">{avatar}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="font-medium text-gray-900">{username}</span>
            <span className="text-gray-500 text-sm ml-2">{timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
            <Trash2 className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  )
}
