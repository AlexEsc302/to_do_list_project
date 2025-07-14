# Tech Log

## 2025-07-14
### Refactor: Use Lombok to Reduce Boilerplate in DTOs and Model

#### Specific Changes Made
- Replaced all explicit getter and setter methods in the following classes with Lombok's `@Data` annotation:
  - `models/ToDo.java`
  - `dto/ToDoCollectionDTO.java`
  - `dto/ToDoInsertData.java`
  - `dto/ToDoModify.java`
- Ensured that constructors are present where needed, and removed redundant code.
- Verified that the Lombok dependency and annotation processor configuration are present in `pom.xml`.

#### New Techniques or Improvements Discovered
- **Lombok Annotations:** Introduced the use of Lombok's `@Data` annotation, which automatically generates getters, setters, `equals`, `hashCode`, and `toString` methods. This was a new technique for reducing boilerplate in Java classes.
- **Cleaner DTOs and Models:** Learned that using Lombok can make DTOs and models much more concise and maintainable, especially in Spring Boot applications.

#### Innovations or Optimizations Implemented
- **Codebase Simplification:** The codebase is now easier to read and maintain, with less manual code and fewer opportunities for human error in getter/setter logic.
- **Centralized Change Logging:** Established a `TECH_LOG.md` file to document all technical changes, making it easier to track improvements and share knowledge with the team.

#### Reflection on Copilot's Impact
- Copilot quickly identified redundant code and suggested the use of Lombok, which was not previously leveraged in this project.
- The suggestions led to a significant reduction in boilerplate and improved code quality.
- Copilot's ability to analyze the codebase and recommend best practices accelerated the refactoring process and introduced new tools and techniques to the workflow.

#### Detailed Prompts Used
- "I need to improve the application, first i want you to analyse the backend, an then I think that there are a lot of redundancy and a lot of code that maybe we can reduse using for example @Getters and thing like that, les start with that"
- "Go ahead with those changes"
- "Can you help me saving the changes or doing a Tech Log of all the changes that we will do?"
- "These are the instructions for the tech Log: you will write a detailed technical log documenting the improvements you implemented. This blog should cover: Specific changes made to the application based on Copilot’s suggestions. New techniques or improvements you discovered and applied, which you were not previously familiar with but were introduced by Copilot. Innovations or optimizations in the codebase that you implemented with the help of Copilot. A reflection on how Copilot helped enhance your development process. Detailed prompts you used."

---

All further backend improvements and refactors will be logged here in detail.
