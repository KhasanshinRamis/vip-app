import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ToolbarTiptop } from '@/components/ui/toolbarTiptop';
import Heading from '@tiptap/extension-heading';

interface TiptapProps {
	onChange: (richText: string) => void;
	description?: string;
	className?: string
}

export const Tiptap = ({ className, onChange, description }: TiptapProps) => {
	const editor = useEditor({
		extensions: [StarterKit.configure({

		}), Heading.configure({
			HTMLAttributes: {
				class: 'text-xl font-bold',
				levels: [2]
			}
		})],
		editorProps: {
			attributes: {
				class:
					'rounded-md border min-h-[150px] border-input disabled:cursor-not-allowed'
			}
		},
		content: description,
		onUpdate({ editor }) {
			onChange(editor.getHTML())
		}
	})

	return (
		<div className={className}>
			<ToolbarTiptop editor={editor} />
			<EditorContent editor={editor} className='min-h-sceen break-words' />
		</div>
	)
}