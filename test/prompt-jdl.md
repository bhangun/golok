

typescript code to convert from SOURCE text to TARGET and bi-directional.

typescript code to convert from SOURCE to json.
SOURCE:
```
relationship ManyToOne {
	Blog{user(login)} to User,
	BlogEntry{blog(name)} to Blog
}

relationship ManyToMany {
	BlogEntry{tag(name)} to Tag{entry}
}

paginate BlogEntry, Tag with infinite-scroll
```

TARGET:
```typescript
{ 
  entities:[
    {Blog:{
        relationship:[
          {user: "User(login), manyToOne"}
        ]
      }
    },
    {BlogEntry:{
        relationship:[
          {blog: "Blog(name), manyToOne"}
        ]
      }
    },
    {BlogEntry:{
        relationship:[
          {tag: "Tag(name), manyToMany"}
        ]
      }
    },
    {Tag:{
        relationship:[
          {entry: "BlogEntry, manyToMany"}
        ]
      }
    }
  ]
}

{
  configuration:{
    pagination: BlogEntry, Tag with infinite-scroll
  }
  
}
```

