<!-- 
Table "users" {
  "id" SERIAL [pk, increment]
  "username" VARCHAR(50) [unique, not null]
  "email" VARCHAR(100) [unique, not null]
  "password_hash" VARCHAR(255) [not null]
  "avatar_url" VARCHAR(255)
  "bio" TEXT
  "is_active" BOOLEAN [default: TRUE]
  "is_admin" BOOLEAN [default: FALSE]
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "updated_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table "categories" {
  "id" SERIAL [pk, increment]
  "name" VARCHAR(100) [not null]
  "slug" VARCHAR(100) [unique, not null]
  "description" TEXT
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "updated_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table "posts" {
  "id" SERIAL [pk, increment]
  "title" VARCHAR(255) [not null]
  "slug" VARCHAR(255) [unique, not null]
  "content" TEXT [not null]
  "excerpt" TEXT
  "status" VARCHAR(20) [not null]
  "view_count" INTEGER [default: 0]
  "user_id" INTEGER
  "category_id" INTEGER
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "updated_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "published_at" TIMESTAMP

  Indexes {
    `to_tsvector('english',title||' '||content||' '||excerpt)` [type: gin, name: "idx_posts_search"]
    user_id [name: "idx_posts_user"]
    category_id [name: "idx_posts_category"]
    status [name: "idx_posts_status"]
  }
}

Table "comments" {
  "id" SERIAL [pk, increment]
  "content" TEXT [not null]
  "status" VARCHAR(20) [default: 'approved']
  "user_id" INTEGER
  "post_id" INTEGER
  "parent_id" INTEGER
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "updated_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]

  Indexes {
    post_id [name: "idx_comments_post"]
    status [name: "idx_comments_status"]
  }
}

Table "refresh_tokens" {
  "id" SERIAL [pk, increment]
  "token" VARCHAR(255) [not null]
  "user_id" INTEGER
  "expires_at" TIMESTAMP [not null]
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]
  "device_info" TEXT
}

Table "tags" {
  "id" SERIAL [pk, increment]
  "name" VARCHAR(50) [unique, not null]
  "slug" VARCHAR(50) [unique, not null]
}

Table "post_tags" {
  "post_id" INTEGER
  "tag_id" INTEGER

  Indexes {
    (post_id, tag_id) [pk]
  }
}

Table "user_favorites" {
  "user_id" INTEGER
  "post_id" INTEGER
  "created_at" TIMESTAMP [default: `CURRENT_TIMESTAMP`]

  Indexes {
    (user_id, post_id) [pk]
  }
}

Ref:"users"."id" < "posts"."user_id" [delete: cascade]

Ref:"categories"."id" < "posts"."category_id" [delete: set null]

Ref:"users"."id" < "comments"."user_id" [delete: set null]

Ref:"posts"."id" < "comments"."post_id" [delete: cascade]

Ref:"comments"."id" < "comments"."parent_id" [delete: cascade]

Ref:"users"."id" < "refresh_tokens"."user_id" [delete: cascade]

Ref:"posts"."id" < "post_tags"."post_id" [delete: cascade]

Ref:"tags"."id" < "post_tags"."tag_id" [delete: cascade]

Ref:"users"."id" < "user_favorites"."user_id" [delete: cascade]

Ref:"posts"."id" < "user_favorites"."post_id" [delete: cascade] -->


https://dbdiagram.io/d/67e64f384f7afba18489b603