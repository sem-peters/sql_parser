<script lang="ts">
    import {Parser} from "./lib/parser/Parser";
    import type {AstNode} from "./lib/parser/types/ast/AstNode";
    import {Tokenizer} from "./lib/parser/Tokenizer";

    let sqlQuery = '';
    let parsedQuery: AstNode = null;
    let tokenized: Token[] = null;
    let debounceTimer: number = -1;
    const updateQuery = (e: Event) => {
        sqlQuery = (e.target as HTMLTextAreaElement).value;
        if (debounceTimer > -1) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            debounceTimer = -1;
            tokenized = new Tokenizer(sqlQuery).tokenize();
            parsedQuery = new Parser(tokenized).parse();
        }, 400)
    }

</script>

<main>
    <textarea class="query-textarea" placeholder="SELECT * FROM table..." on:input={updateQuery}/>

    <p>Tokens</p>
    <pre>
        <code>
            {#if tokenized}
              {JSON.stringify(tokenized)}
            {/if}
        </code>
    </pre>

    <p>AST</p>
    <pre>
      <code>
        {#if parsedQuery}
          {JSON.stringify(parsedQuery)}
        {/if}
      </code>
  </pre>
</main>