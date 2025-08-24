import type { Comment } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar'

const CommentsList = ({ comments }: { comments: Comment[] }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.userId}`} />
              <AvatarFallback>
                {comment.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {comment.username || 'Usuario desconocido'}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: es
                  })}
                </span>
              </div>
              
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentsList