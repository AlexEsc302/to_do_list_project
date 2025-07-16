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

## 2025-07-15
### Cleanup: Removed Java Collections Implementation to Focus on JPA/H2

#### Specific Changes Made
- Deleted all code and files related to the in-memory Java Collections implementation:
  - Removed `ToDoServiceCollections.java` (service for collections-based logic)
  - Removed `ToDoRepositoryCollections.java` (repository for collections-based logic)
  - Removed `ToDoCollectionDTO.java` (DTO used only for collections logic)
- Refactored `ToDoController.java` to remove all endpoints, fields, and imports related to the collections implementation. Now only the JPA/H2-based logic remains.
- Verified that the application compiles and runs with only the database-backed implementation.

#### New Techniques or Improvements Discovered
- **Separation of Concerns:** Learned the importance of keeping only one source of truth for data (the database) to avoid confusion and redundancy in the codebase.
- **Incremental Refactoring:** Used Copilot to safely identify and remove all references to the collections-based logic, ensuring a clean transition to a single implementation.

#### Innovations or Optimizations Implemented
- **Simplified Backend:** The backend is now focused solely on JPA/H2, making it easier to maintain, test, and extend.
- **Reduced Redundancy:** Eliminated duplicate logic and endpoints, streamlining the codebase and reducing potential bugs.

#### Reflection on Copilot's Impact
- Copilot quickly identified all files and code regions related to the collections implementation, making the cleanup process efficient and safe.
- The suggestions ensured that no references to the old logic remained, preventing runtime errors and confusion.
- Copilot's step-by-step approach helped maintain project stability during the refactor.

#### Detailed Prompts Used
- "Firts of all, we need to only keep the JPA and H2 database implementation, so lets erase everything about the Java Collections implementation, then we will improve that part, but first clean all the project so we can focus in the database implementation"

---

## 2025-07-15
### Security Improvements: Dependency, Configuration, Validation, and Error Handling

#### Specific Changes Made
- Replaced hardcoded database password in `application.properties` with an environment variable (`spring.datasource.password=${DB_PASSWORD:}`) and added a comment about using environment variables for sensitive data.
- Added a warning comment to `application.properties` to disable the H2 console in production.
- Added a comment to `application.properties` recommending HTTPS and secure headers for production deployments.
- Added a `GlobalExceptionHandler` class to standardize error responses and avoid leaking stack traces.
- Added validation annotations (`@NotBlank`, `@NotNull`, `@Size`) to `ToDoInsertData` DTO fields to enforce input validation.
- Added the `jakarta.validation-api` dependency to `pom.xml` to support validation annotations.

#### Why These Changes Were Needed
- Hardcoded credentials and exposed dev tools are common security risks (see OWASP A3:2017, A5:2017).
- Secure error handling prevents attackers from learning about application internals (OWASP A6:2017).
- Input validation is critical to prevent injection and ensure data integrity (OWASP A1:2017).
- Using up-to-date, secure dependencies is essential for a safe codebase.

#### Impact of the Changes
- Credentials are no longer exposed in source code.
- The H2 console is less likely to be left open in production.
- Error messages are now user-friendly and do not leak sensitive information.
- Input validation is enforced at the DTO level, reducing the risk of attacks via malformed input.
- The codebase is more secure and ready for further enhancements (e.g., authentication/authorization).

#### References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)

#### Detailed Prompts Used
- "Perform all the necessary security-related changes and updates in the application’s codebase..."

---

## 2025-07-15
### Enhancement: Comprehensive Error Handling & Validation Implementation

#### Specific Changes Made
1. Created and organized exception hierarchy:
   - `BusinessException`: Base exception for business logic errors
   - `TodoNotFoundException`: For handling non-existent todo items
   - `TodoValidationException`: For validation failures

2. Implemented standardized API response wrapper:
   - Added `ApiResponse<T>` class with fields:
     ```json
     {
       "success": boolean,
       "data": T,
       "message": string,
       "errorCode": string
     }
     ```

3. Implemented centralized exception handling:
   - Created `GlobalExceptionHandler` with specific handlers:
     - 404 Not Found: TodoNotFoundException
     - 400 Bad Request: TodoValidationException, BusinessException
     - 500 Internal Server Error: Unexpected exceptions

4. Enhanced validation rules:
   - Todo name: Required, max 100 characters
   - Description: Optional, max 255 characters
   - Priority: Required
   - Due date: Must not be in the past

#### Technical Improvements
1. **Consistent Response Format**
   - All endpoints now use `ApiResponse` wrapper
   - Standardized success and error responses
   - Machine-readable error codes for client handling

2. **Robust Input Validation**
   - Controller-level validation with `@Validated`
   - Service-layer business rule validation
   - Clear, specific validation messages

3. **Exception Management**
   - Hierarchical exception structure
   - Consistent error response format
   - Environment-appropriate error details

#### Impact of Changes
- Improved error handling predictability
- Better client-side error handling support
- Enhanced data integrity through validation
- More maintainable error management

#### Reflection on Implementation
- Moved from basic exception handling to a comprehensive solution
- Standardized responses improve API consistency
- Validation at multiple layers provides better data security

---
