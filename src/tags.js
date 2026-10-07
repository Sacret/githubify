import { useEffect, useState } from 'react';
import { child, onValue, push, ref, remove, update } from 'firebase/database';
//
import { db, userPath } from './firebase';

export const MAX_TAGS = 50;
export const MAX_TAG_LENGTH = 50;

function tagsRef(userId) {
  return ref(db, userPath(userId) + '/tags');
}

/**
 *  Removes characters forbidden in database keys and trims the name
 */
export function normalizeTagName(name) {
  return name.replace(/[<>.#$[\]/]/g, '').trim().slice(0, MAX_TAG_LENGTH).trim();
}

/**
 *  Subscribes to user's tags. Returns null while loading, then
 *  sorted array of { key, repos } where repos maps db keys to repo ids
 */
export function useTags(userId) {
  const [tags, setTags] = useState(null);

  useEffect(() => onValue(tagsRef(userId), (snapshot) => {
    const value = snapshot.val() || {};
    const list = Object.keys(value).sort().map((key) => {
      const repos = {};
      Object.entries(value[key].repos || {}).forEach(([repoKey, repo]) => {
        if (repo) {
          repos[repoKey] = repo.id;
        }
      });
      return { key, repos };
    });
    setTags(list);
  }), [userId]);

  return tags;
}

export function tagRepoIds(tag) {
  return Object.values(tag.repos);
}

export function addRepoTags(userId, tagNames, repoId) {
  const updates = {};
  tagNames.forEach((name) => {
    const repoKey = push(child(tagsRef(userId), name + '/repos')).key;
    updates[name + '/repos/' + repoKey] = { id: repoId };
  });
  return update(tagsRef(userId), updates);
}

export function removeRepoTag(userId, tag, repoId) {
  const updates = {};
  Object.entries(tag.repos).forEach(([repoKey, id]) => {
    if (id === repoId) {
      updates[tag.key + '/repos/' + repoKey] = null;
    }
  });
  return update(tagsRef(userId), updates);
}

export function deleteTag(userId, tagKey) {
  return remove(child(tagsRef(userId), tagKey));
}

/**
 *  Moves repos of tag to the new name (merging with existing tag)
 */
export function renameTag(userId, tag, newKey, existingTag) {
  const existingIds = existingTag ? tagRepoIds(existingTag) : [];
  const updates = { [tag.key]: null };
  tagRepoIds(tag)
    .filter((id) => !existingIds.includes(id))
    .forEach((id) => {
      const repoKey = push(child(tagsRef(userId), newKey + '/repos')).key;
      updates[newKey + '/repos/' + repoKey] = { id };
    });
  return update(tagsRef(userId), updates);
}
