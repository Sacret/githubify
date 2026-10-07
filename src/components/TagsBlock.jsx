import { useRef, useState } from 'react';
//
import { toggle, useFilters } from '../filters';
import { deleteTag, normalizeTagName, renameTag } from '../tags';

/**
 *  TagsBlock contains list of all tags
 */
export default function TagsBlock({ tags, openUser, isOwner }) {
  const { filters, setFilters } = useFilters();
  const [editingKey, setEditingKey] = useState(null);
  // Guards against double submit by Enter and following blur
  const isSubmitting = useRef(false);

  if (!tags) {
    return <div className="tags-block" />;
  }

  function removeTag(e, tag) {
    e.stopPropagation();
    deleteTag(openUser.id, tag.key);
    setFilters({ tags: filters.tags.filter((key) => key !== tag.key) });
  }

  function startEditing(e, tag) {
    e.stopPropagation();
    isSubmitting.current = false;
    setEditingKey(tag.key);
  }

  async function submitEditing(tag, value) {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;
    const newKey = normalizeTagName(value);
    setEditingKey(null);
    if (!newKey || newKey === tag.key) {
      return;
    }
    await renameTag(openUser.id, tag, newKey, tags.find((t) => t.key === newKey));
    if (filters.tags.includes(tag.key)) {
      const newTags = filters.tags.filter((key) => key !== tag.key && key !== newKey);
      setFilters({ tags: [...newTags, newKey] });
    }
  }

  function handleKeyUp(e, tag) {
    if (e.key === 'Enter') {
      submitEditing(tag, e.target.value);
    }
    else if (e.key === 'Escape') {
      isSubmitting.current = true;
      setEditingKey(null);
    }
  }

  let content;
  if (!tags.length && isOwner) {
    content = <p>You don't have any tags yet. Feel free to add them</p>;
  }
  else if (!tags.length) {
    content = (
      <p>
        Unfortunately this user doesn't have any tags on githubify.
        {openUser.email ?
          <span>&nbsp;Let them know about it on email:&nbsp;
            <a href={'mailto:' + openUser.email + '?subject=githubify.me'}>
              {openUser.email}
            </a>
          </span> :
          null
        }
      </p>
    );
  }
  else {
    content = tags.map((tag) => {
      const isEditing = editingKey === tag.key;
      const className = 'tag' +
        (filters.tags.includes(tag.key) || isEditing ? ' active' : '') +
        (isEditing ? ' editing-tag' : '');
      return (
        <span
          className={className}
          key={tag.key}
          onClick={() => isEditing || setFilters({ tags: toggle(filters.tags, tag.key) })}
        >
          {isEditing ?
            <input
              type="text"
              className="form-control tag-edit-input"
              defaultValue={tag.key}
              autoFocus
              onKeyUp={(e) => handleKeyUp(e, tag)}
              onBlur={(e) => submitEditing(tag, e.target.value)}
            /> :
            tag.key
          }
          {isOwner ?
            <>
              <i
                className="fa fa-times tag-icon tag-remove-icon"
                title="Remove tag"
                onClick={(e) => removeTag(e, tag)}
              />
              <i
                className="fa fa-pencil tag-icon tag-edit-icon"
                title="Edit tag"
                onClick={(e) => startEditing(e, tag)}
              />
            </> :
            null
          }
        </span>
      );
    });
  }

  return <div className="tags-block">{content}</div>;
}
